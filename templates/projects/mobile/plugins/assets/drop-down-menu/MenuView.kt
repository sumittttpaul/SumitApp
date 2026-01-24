package com.reactnativemenu

import android.content.Context
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.view.*
import android.widget.ArrayAdapter
import android.widget.ImageView
import android.widget.ListView
import android.widget.PopupWindow
import android.widget.TextView
import com.facebook.react.bridge.*
import com.facebook.react.uimanager.UIManagerHelper
import com.facebook.react.views.view.ReactViewGroup

class MenuView(private val mContext: ReactContext) : ReactViewGroup(mContext) {
    private lateinit var mActions: ReadableArray
    private var mIsMenuDisplayed = false
    private var mIsOnLongPress = false
    private var mGestureDetector: GestureDetector
    private var mPopupWindow: PopupWindow? = null

    init {
        mGestureDetector = GestureDetector(mContext, object : GestureDetector.SimpleOnGestureListener() {
            override fun onLongPress(e: MotionEvent) {
                if (!mIsOnLongPress) return
                prepareMenu()
            }

            override fun onSingleTapUp(e: MotionEvent): Boolean {
                if (!mIsOnLongPress) prepareMenu()
                return true
            }
        })
    }

    fun show() {
        prepareMenu()
    }

    fun setActions(actions: ReadableArray) {
        mActions = actions
    }

    fun setIsOpenOnLongPress(isLongPress: Boolean) {
        mIsOnLongPress = isLongPress
    }

    private val getActionsCount: Int get() = mActions.size()
    override fun onInterceptTouchEvent(ev: MotionEvent): Boolean = true
    override fun onTouchEvent(ev: MotionEvent): Boolean {
        mGestureDetector.onTouchEvent(ev)
        return true
    }

    override fun onDetachedFromWindow() {
        super.onDetachedFromWindow()
        if (mIsMenuDisplayed) {
            mPopupWindow?.dismiss()
        }
    }

    private fun prepareMenu() {
        if (getActionsCount <= 0) return

        val inflater = context.getSystemService(Context.LAYOUT_INFLATER_SERVICE) as LayoutInflater
        val layout = inflater.inflate(R.layout.popup_menu_container, null)
        val listView = layout.findViewById<ListView>(R.id.menu_list_view)

        val adapter = MenuAdapter(mContext, R.layout.list_item_menu, mActions)
        listView.adapter = adapter

        mPopupWindow = PopupWindow(layout, ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.WRAP_CONTENT, true)
        mPopupWindow?.animationStyle = R.style.CustomPopupMenuAnimation
        mPopupWindow?.setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        mPopupWindow?.isOutsideTouchable = true

        listView.setOnItemClickListener { _, _, position, _ ->
            val action = mActions.getMap(position)
            val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(mContext, id)
            val surfaceId = UIManagerHelper.getSurfaceId(this)
            dispatcher?.dispatchEvent(MenuOnPressActionEvent(surfaceId, id, action?.getString("id"), position))
            mPopupWindow?.dismiss()
        }

        mPopupWindow?.setOnDismissListener {
            mIsMenuDisplayed = false
            val dispatcher = UIManagerHelper.getEventDispatcherForReactTag(mContext, id)
            val surfaceId = UIManagerHelper.getSurfaceId(this)
            dispatcher?.dispatchEvent(MenuOnCloseEvent(surfaceId, id, id))
        }

        mIsMenuDisplayed = true
        
        val location = IntArray(2)
        this.getLocationOnScreen(location)
        val yAnchor = location[1]

        val density = context.resources.displayMetrics.density
        val xOffsetFromRight = (8 * density).toInt()
        val yOffsetFromTop = yAnchor + this.height

        mPopupWindow?.showAtLocation(this.rootView, Gravity.TOP or Gravity.RIGHT, xOffsetFromRight, yOffsetFromTop)
   }
}

class MenuAdapter(context: Context, private val resource: Int, private val actions: ReadableArray) :
    ArrayAdapter<ReadableMap>(context, resource, (0 until actions.size()).map { actions.getMap(it) }) {

    override fun getView(position: Int, convertView: View?, parent: ViewGroup): View {
        val view = convertView ?: LayoutInflater.from(context).inflate(resource, parent, false)
        val action = getItem(position)

        val titleView = view.findViewById<TextView>(R.id.menu_item_title)
        val iconView = view.findViewById<ImageView>(R.id.menu_item_icon)

        titleView.text = action?.getString("title")

        val imageName = if (action?.hasKey("image") == true) action.getString("image") else null

        if (imageName != null) {
            var resourceId = context.resources.getIdentifier(imageName, "drawable", context.packageName)

            if (resourceId == 0) {
                try {
                    val idField = android.R.drawable::class.java.getDeclaredField(imageName)
                    resourceId = idField.getInt(idField)
                } catch (e: Exception) {
                    e.printStackTrace()
                }
            }
            
            if (resourceId != 0) {
                iconView.setImageResource(resourceId)
                iconView.visibility = View.VISIBLE
            } else {
                iconView.visibility = View.GONE
            }
        } else {
            iconView.visibility = View.GONE
        }

        return view
    }
}